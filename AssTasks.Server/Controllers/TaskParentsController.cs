﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;
using AssTasks.Server.Services.Interfaces;
using Microsoft.Build.Framework;

namespace AssTasks.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskParentsController : ControllerBase
    {
        private readonly IAssTaskService assTaskService;
        private readonly ITaskParentRepository taskParentRepository;
        private readonly IAssTaskRepository assTaskRepository;
        private readonly IUserRepository userRepository;

        public TaskParentsController(
            IAssTaskService assTaskService,
            ITaskParentRepository taskParentRepository,
            IAssTaskRepository assTaskRepository,
            IUserRepository userRepository)
        {
            this.assTaskService = assTaskService;
            this.taskParentRepository = taskParentRepository;
            this.assTaskRepository = assTaskRepository;
            this.userRepository = userRepository;
        }

        /// <summary>
        /// Retrieves all TaskParents
        /// </summary>
        /// <returns>A list of TaskParents</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskParent>>> GetTaskParents()
        {
            var taskParents = await taskParentRepository.GetAllAsync();
            return Ok(taskParents.OrderBy(x => x.Active).OrderBy(x => x.CreatedAt).OrderBy(x => x.Title));
        }

        /// <summary>
        /// Retrieves a TaskParent by Id
        /// </summary>
        /// <param name="id">The Id to retrieve the TaskParent by</param>
        /// <returns>The requested TaskParent</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskParent>> GetTaskParent(int id)
        {
            var taskParent = await taskParentRepository.GetByIdAsync(id);
            return taskParent != null ? Ok(taskParent) : NotFound();
        }

      
        /// <summary>
        /// Creates a TaskParent
        /// </summary>
        /// <param name="taskParent"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<TaskParent>> PostTaskParent(TaskParent taskParent)
        {
            await taskParentRepository.AddAsync(taskParent);
            return CreatedAtAction(nameof(GetTaskParent), new { id = taskParent.Id }, taskParent);
        }

        /// <summary>
        /// Creates a TaskParent and generates its AssTask along with it
        /// </summary>
        /// <param name="createTaskView"></param>
        /// <returns></returns>
        [HttpPost("CreateAndGenerateTask")]
        public async Task<ActionResult<AssTask>> PostTaskParentAndGenerateTask(CreateAssTaskView createTaskView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Add timestamp to taskParent
            createTaskView.CreatedAt = DateTime.UtcNow;

            // Create the task parent
            await taskParentRepository.AddAsync(createTaskView);

            // Generate a task from the parent
            var generatedTask = assTaskService.GenerateTaskFromParent(createTaskView as TaskParent, createTaskView.StartDate);
            generatedTask.OwnerId = createTaskView.OwnerId;
            await assTaskRepository.AddAsync(generatedTask);

            // Return the generated task
            generatedTask.TaskParent = createTaskView;
            return Ok(generatedTask);
        }

        /// <summary>
        /// Toggles the Active property of a TaskParent by Id
        /// </summary>
        /// <param name="taskParentId">The TaskParent Id</param>
        /// <returns></returns>
        [HttpPost("{taskParentId:int}/ToggleTaskParentActive")]
        public async Task<IActionResult> ToggleTaskParentStatus([FromRoute] int taskParentId)
        {
            var taskParent = await taskParentRepository.GetByIdAsync(taskParentId);

            if (taskParent == null)
            {
                return NotFound();
            }

            if (taskParent.Active)
            { // Deactivate
                // Delete any related AssTasks
                await assTaskRepository.DeleteByCriteriaAsync(x => x.TaskParentId == taskParent.Id);
            }
            else
            { // Activate
                // Generate a new task
                var generatedTask = assTaskService.GenerateTaskFromParent(taskParent);
                var assignedUser = (await userRepository.GetAllAsync()).FirstOrDefault();
                generatedTask.OwnerId = assignedUser?.Id;
                await assTaskRepository.AddAsync(generatedTask);
            }

            // Toggle the parent
            taskParent.Active = !taskParent.Active;
            await taskParentRepository.UpdateAsync(taskParent);

            return NoContent();
        }

        /// <summary>
        /// Updates a TaskParent by Id
        /// </summary>
        /// <param name="taskParentId">The TaskParent Id</param>
        /// <returns></returns>
        [HttpPut("{taskParentId:int}")]
        public async Task<IActionResult> UpdateTaskParent([FromRoute] int taskParentId, CreateAssTaskView updatedTaskParent)
        {
            if (updatedTaskParent == null)
            {
                return NotFound();
            }

            await taskParentRepository.UpdateAsync(updatedTaskParent);

            return NoContent();
        }

        /// <summary>
        /// Deletes a TaskParent by Id
        /// </summary>
        /// <param name="id">The Id to delete by</param>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskParent(int id)
        {
            // Get TaskParent
            var taskParent = await taskParentRepository.GetByIdAsync(id);
      
            if (taskParent == null)
            {
                return NotFound();
            }

            // Remove any related AssTasks
            await assTaskRepository.DeleteByCriteriaAsync(at => at.TaskParentId == taskParent.Id);

            // Remove ParentTask
            await taskParentRepository.DeleteByIdAsync(taskParent.Id);

            return NoContent();
        }
    }
}
