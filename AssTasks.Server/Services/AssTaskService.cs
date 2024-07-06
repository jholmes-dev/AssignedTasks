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
            TaskConstants.DAYS_TASK => await GenerateDaysTask(parent),
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
            // If no tasks exist, we generate one for today. Otherwise we generate one based off the parent's period
            var dueDate = parent.AssTasks.Count == 0 ? DateTime.UtcNow : DateTime.UtcNow.AddDays(parent.Frequency);

            // Generate new AssTask
            var newTask = new AssTask
            {
                TaskParentId = parent.Id,
                CreatedAt = DateTime.UtcNow,
                DueAt = dueDate
            };

            // Add new task to the database
            await _context.AssTasks.AddAsync(newTask);
            await _context.SaveChangesAsync();

            return newTask;
        }

        public async Task<AssTask> GenerateDaysTask(TaskParent parent)
        {
            // Get start date, and set it to the previous-most Sunday
            var startDate = parent.CreatedAt.AddDays(-(int)parent.CreatedAt.DayOfWeek);

            // Get today, and set to the previous-most Sunday
            var today = DateTime.UtcNow.AddDays(-(int)DateTime.UtcNow.DayOfWeek);

            // If there are no more upcoming task days this week, add a week to today
            if (parent.Days != null && parent.Days.Last() < (int)DateTime.UtcNow.DayOfWeek)
            {
                today = today.AddDays(7);
            }

            // Get number of weeks until the next active week
            var weeks = (int)((today - startDate).TotalDays / 7) % parent.Frequency;
            weeks = weeks == 0 ? 0 : parent.Frequency - weeks;
            
            // Add that number of days to today
            today = today.AddDays(weeks * 7);

            // Loop through days array, find next non-passed day
            var nextDate = DateTime.UtcNow;
            foreach (var day in parent.Days!) 
            {
                if (day >= (int)DateTime.UtcNow.DayOfWeek)
                {
                    nextDate = today.AddDays(day);
                }
            }

            // Create next AssTask
            var newTask = new AssTask
            {
                TaskParentId = parent.Id,
                CreatedAt = DateTime.UtcNow,
                DueAt = nextDate
            };

            // Add new task to the database
            await _context.AssTasks.AddAsync(newTask);
            await _context.SaveChangesAsync();

            return newTask;
        }
    }
}
