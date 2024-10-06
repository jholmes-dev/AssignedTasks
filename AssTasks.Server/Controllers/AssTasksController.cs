using Microsoft.AspNetCore.Mvc;
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
    }
}
