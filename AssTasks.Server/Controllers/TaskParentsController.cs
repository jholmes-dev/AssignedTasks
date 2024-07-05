using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssTasks.Server.Models;
using AssTasks.Server.Services;

namespace AssTasks.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskParentsController : ControllerBase
    {
        private readonly AssTasksContext _context;
        private readonly AssTaskService _assTaskService;

        public TaskParentsController(
            AssTasksContext context,
            AssTaskService assTaskService
        ) {
            _context = context;
            _assTaskService = assTaskService;
        }

        // GET: api/TaskParents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskParent>>> GetTaskParents()
        {
            return await _context.TaskParents.ToListAsync();
        }

        // GET: api/TaskParents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskParent>> GetTaskParent(long id)
        {
            var taskParent = await _context.TaskParents.FindAsync(id);

            if (taskParent == null)
            {
                return NotFound();
            }

            return taskParent;
        }

        // PUT: api/TaskParents/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskParent(long id, TaskParent taskParent)
        {
            if (id != taskParent.Id)
            {
                return BadRequest();
            }

            _context.Entry(taskParent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskParentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TaskParents
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TaskParent>> PostTaskParent(TaskParent taskParent)
        {
            _context.TaskParents.Add(taskParent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostTaskParent), new { id = taskParent.Id }, taskParent);
        }

        // POST: api/TaskParents/CreateWithTask
        [HttpPost("CreateAndGenerateTask")]
        public async Task<ActionResult<AssTask>> PostTaskParentAndGenerateTask(TaskParent taskParent)
        {
            // Create the task parent
            _context.TaskParents.Add(taskParent);
            await _context.SaveChangesAsync();

            // Generate a task from the parent
            var generatedTask = await _assTaskService.GenerateTaskFromParent(taskParent);
            generatedTask.TaskParent = taskParent;

            return Ok(generatedTask);

            //return CreatedAtAction(nameof(PostTaskParentAndGenerateTask), new { id = generatedTask.Id }, generatedTask);
        }

        // DELETE: api/TaskParents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskParent(long id)
        {
            var taskParent = await _context.TaskParents.FindAsync(id);
            if (taskParent == null)
            {
                return NotFound();
            }

            _context.TaskParents.Remove(taskParent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskParentExists(long id)
        {
            return _context.TaskParents.Any(e => e.Id == id);
        }
    }
}
