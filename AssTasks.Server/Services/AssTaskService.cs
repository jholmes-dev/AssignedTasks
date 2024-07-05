using AssTasks.Server.Models;
using AssTasks.Server.Constants;

namespace AssTasks.Server.Services
{
    public class AssTaskService
    {
        private readonly AssTasksContext _context;

        public AssTaskService(
            AssTasksContext context
        ) {
            _context = context;
        }

        /// <summary>
        /// Generates and returns a new AssTask from the given parent
        /// </summary>
        /// <param name="parent">The parent to draw details from</param>
        /// <returns>A newly generated AssTask</returns>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if the provided parent.FrequencyType is not supported</exception>
        public async Task<AssTask> GenerateTaskFromParent(TaskParent parent) => parent.FrequencyType switch
        {
            TaskConstants.INTERVAL_TASK => await GenerateIntervalTask(parent),
            // TaskConstants.DAYS_TASK => 
            _ => throw new ArgumentOutOfRangeException($"ParentTask.FrequencyType value is not supported: {parent.FrequencyType}"),
        };

        /// <summary>
        /// Generates an interval type task. Interval type tasks are always generated off the current day
        /// as to avoid timing issues when a task is completed early or late.
        /// </summary>
        /// <param name="parent">The task's parent to draw details from</param>
        /// <returns>A new interval based AssTask</returns>
        public async Task<AssTask> GenerateIntervalTask(TaskParent parent)
        {
            // Generate new AssTask
            var newTask = new AssTask
            {
                TaskParentId = parent.Id,
                CreatedAt = DateTime.UtcNow,
                DueAt = DateTime.UtcNow.AddDays(parent.Frequency)
            };

            // Add new task to the database
            await _context.AssTasks.AddAsync(newTask);
            await _context.SaveChangesAsync();

            return newTask;
        }
    }
}
