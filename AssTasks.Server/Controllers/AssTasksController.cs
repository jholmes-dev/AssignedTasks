using Microsoft.AspNetCore.Mvc;
using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssTasksController : ControllerBase
    {
        private readonly IAssTaskRepository assTaskRepository;

        public AssTasksController(
            IAssTaskRepository assTaskRepository)
        {
            this.assTaskRepository = assTaskRepository;
        }

        /// <summary>
        /// Returns all AssTasks with their related parent
        /// </summary>
        /// <returns>A collection of AssTasks</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssTask>>> GetAssTasks()
        {
            return Ok(
                await assTaskRepository.GetAsync(null, x => x.OrderBy(y => y.DueAt), "TaskParent")
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssTask(int id)
        {
            await assTaskRepository.DeleteByIdAsync(id);
            return NoContent();
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteAssTask(int id)
        {
            // TODO: Mark task as complete and generate new task

            return NoContent();
        }
    }
}
