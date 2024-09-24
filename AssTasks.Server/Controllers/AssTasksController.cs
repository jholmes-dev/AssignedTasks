using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssTasks.Server.Models;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssTasksController : ControllerBase
    {
        private readonly AssTasksContext _context;
        private readonly IAssTaskRepository assTaskRepository;

        public AssTasksController(
            AssTasksContext context,
            IAssTaskRepository assTaskRepository)
        {
            _context = context;
            this.assTaskRepository = assTaskRepository;
        }

        // GET: api/AssTasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssTask>>> GetAssTasks()
        {
            var assTasks = await _context.AssTasks
                .Include(at => at.TaskParent)
                .OrderBy(at => at.DueAt)
                .ToListAsync();

            return assTasks;
        }

        // GET: api/AssTasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AssTask>> GetAssTask(int id)
        {
            var assTask = await _context.AssTasks.FindAsync(id);

            if (assTask == null)
            {
                return NotFound();
            }

            return assTask;
        }

        // PUT: api/AssTasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAssTask(int id, AssTask assTask)
        {
            if (id != assTask.Id)
            {
                return BadRequest();
            }

            _context.Entry(assTask).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssTaskExists(id))
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

        // POST: api/AssTasks
        // AssTasks should not be directly generatable. They should only
        // Need to be generated through their parent.
        // TODO: Delete this method once confirmed
        [HttpPost]
        public async Task<ActionResult<AssTask>> PostAssTask(AssTask assTask)
        {
            _context.AssTasks.Add(assTask);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAssTask", new { id = assTask.Id }, assTask);
        }

        // DELETE: api/AssTasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssTask(int id)
        {
            var assTask = await _context.AssTasks.FindAsync(id);
            if (assTask == null)
            {
                return NotFound();
            }

            _context.AssTasks.Remove(assTask);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteAssTask(int id)
        {
            var assTask = await _context.AssTasks.FindAsync(id);
            if (assTask == null)
            {
                return NotFound();
            }

            // TODO: Mark task as complete and generate new task

            return NoContent();
        }

        private bool AssTaskExists(int id)
        {
            return _context.AssTasks.Any(e => e.Id == id);
        }
    }
}
