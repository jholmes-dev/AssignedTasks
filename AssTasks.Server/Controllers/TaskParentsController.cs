using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;
using AssTasks.Server.Services.Interfaces;

namespace AssTasks.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskParentsController : ControllerBase
    {
        private readonly IAssTaskService assTaskService;
        private readonly ITaskParentRepository taskParentRepository;
        private readonly IAssTaskRepository assTaskRepository;

        public TaskParentsController(
            IAssTaskService assTaskService,
            ITaskParentRepository taskParentRepository,
            IAssTaskRepository assTaskRepository)
        {
            this.assTaskService = assTaskService;
            this.taskParentRepository = taskParentRepository;
            this.assTaskRepository = assTaskRepository;
        }

        /// <summary>
        /// Retrieves all TaskParents
        /// </summary>
        /// <returns>A list of TaskParents</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskParent>>> GetTaskParents()
        {
            return Ok(
                await taskParentRepository.GetAllAsync()
            );
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
            // Add timestamp to taskParent
            createTaskView.CreatedAt = DateTime.UtcNow;

            // Create the task parent
            await taskParentRepository.AddAsync(createTaskView);

            // Generate a task from the parent
            var generatedTask = assTaskService.GenerateTaskFromParent(createTaskView as TaskParent, createTaskView.StartDate);
            await assTaskRepository.AddAsync(generatedTask);

            // Return the generated task
            generatedTask.TaskParent = createTaskView;
            return Ok(generatedTask);
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
