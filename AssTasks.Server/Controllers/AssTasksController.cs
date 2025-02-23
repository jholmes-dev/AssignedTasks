﻿using Microsoft.AspNetCore.Mvc;
using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;
using AssTasks.Server.Services.Interfaces;

namespace AssTasks.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssTasksController : ControllerBase
    {
        private readonly IAssTaskRepository assTaskRepository;
        private readonly IAssTaskService assTaskService;

        public AssTasksController(
            IAssTaskRepository assTaskRepository,
            IAssTaskService assTaskService)
        {
            this.assTaskRepository = assTaskRepository;
            this.assTaskService = assTaskService;
        }

        /// <summary>
        /// Returns all non-completed AssTasks with their related parent
        /// </summary>
        /// <returns>A collection of AssTasks</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssTask>>> GetAssTasks()
        {
            return Ok(
                await assTaskRepository.GetAsync(x => x.CompletedAt == null, x => x.OrderBy(y => y.DueAt), "TaskParent,Owner")
            );
        }

        /// <summary>
        /// Returns an AssTask by Id
        /// </summary>
        /// <param name="id">The Id to return by</param>
        /// <returns>The requested AssTask if found</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<AssTask>> GetAssTask(int id)
        {
            var assTask = await assTaskRepository.GetByIdAsync(id);
            return assTask != null ? Ok(assTask) : NotFound();
        }

        /// <summary>
        /// Deletes an AssTask by ID
        /// </summary>
        /// <param name="id">The Id to delete by</param>
        /// <returns></returns>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAssTask(int id)
        {
            await assTaskRepository.DeleteByIdAsync(id);
            return NoContent();
        }

        /// <summary>
        /// Completes an AssTask and generates the next for the series
        /// </summary>
        /// <param name="taskId"></param>
        /// <param name="startDate"></param>
        /// <returns></returns>
        [HttpPost("{taskId:int}/Complete")]
        public async Task<IActionResult> CompleteAssTask(int taskId, DateTime? startDate)
        {
            await assTaskService.CompleteAndGenerateNewTask(taskId, startDate);
            return NoContent();
        }

        /// <summary>
        /// Reassigns an AssTask to a new owner
        /// </summary>
        /// <param name="taskId">The task Id</param>
        /// <param name="newOwnerId">The new Owner's Id</param>
        [HttpPost("{taskId:int}/Reassign")]
        public async Task<IActionResult> ReassignAssTask([FromRoute] int taskId, [FromBody] int newOwnerId)
        {
            var assTask = await assTaskRepository.GetByIdAsync(taskId);

            if (assTask == null)
            {
                return NotFound();
            }

            assTask.OwnerId = newOwnerId;
            await assTaskRepository.UpdateAsync(assTask);

            return NoContent();
        }

        /// <summary>
        /// Snoozes a given AssTask by assigning the next available due date
        /// </summary>
        /// <param name="taskId">The Id of the AssTask to snooze</param>
        [HttpPost("{taskId:int}/Snooze")]
        public async Task<IActionResult> SnoozeAssTask([FromRoute] int taskId)
        {
            var assTask = (await assTaskRepository.GetAsync(x => x.Id == taskId, null, "TaskParent")).FirstOrDefault();

            if (assTask == null)
            {
                return NotFound();
            }

            // Generate a new task from parent, and take the start date
            var newTask = assTaskService.GenerateTaskFromParent(assTask.TaskParent);
            assTask.DueAt = newTask.DueAt;
            await assTaskRepository.UpdateAsync(assTask);

            return NoContent();
        }

        /// <summary>
        /// Updates an AssTask's due date directly
        /// </summary>
        /// <param name="taskId">The task to update</param>
        /// <param name="newDueDate">The new due date to set</param>
        [HttpPut("{taskId:int}/DueDate")]
        public async Task<IActionResult> SetAssTaskDueDate([FromRoute] int taskId, [FromBody] DateTime newDueDate)
        {
            var assTask = await assTaskRepository.GetByIdAsync(taskId);

            if (assTask == null)
            {
                return NotFound();
            }

            assTask.DueAt = newDueDate;
            await assTaskRepository.UpdateAsync(assTask);

            return NoContent();
        }
    }
}
