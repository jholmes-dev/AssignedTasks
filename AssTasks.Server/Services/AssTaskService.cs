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
        public AssTask GenerateTaskFromParent(TaskParent parent) => parent.FrequencyType switch
        {
            TaskConstants.INTERVAL_TASK => GenerateIntervalTask(parent),
            TaskConstants.DAYS_TASK => GenerateDaysTask(parent),
            _ => throw new ArgumentOutOfRangeException($"ParentTask.FrequencyType value is not supported: {parent.FrequencyType}"),
        };

        /// <summary>
        /// Generates an interval type task. Interval type tasks are always generated off the current day
        /// as to avoid timing issues when a task is completed early or late.
        /// </summary>
        /// <param name="parent">The task's parent to draw details from</param>
        /// <returns>A new interval based AssTask</returns>
        public AssTask GenerateIntervalTask(TaskParent parent)
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

            return newTask;
        }

        public AssTask GenerateDaysTask(TaskParent parent)
        {
            // Get start date, and set it to the previous-most Sunday
            var startDate = parent.CreatedAt.AddDays(-(int)parent.CreatedAt.DayOfWeek);

            // Get today, and set to the previous-most Sunday
            var taskDate = DateTime.UtcNow.AddDays(-(int)DateTime.UtcNow.DayOfWeek);

            // Current timestamp
            var currentDateTime = DateTime.UtcNow;

            // If there are no more upcoming task days this week, add a week to today
            if (parent.Days != null && parent.Days.Last() < (int)currentDateTime.DayOfWeek)
            {
                taskDate = taskDate.AddDays(7);
            }

            // Get number of weeks until the next active week
            var weeks = (int)((taskDate - startDate).TotalDays / 7) % parent.Frequency;
            weeks = weeks == 0 ? 0 : parent.Frequency - weeks;

            // Add that number of days to today
            taskDate = taskDate.AddDays(weeks * 7);

            // Loop through days array, find next non-passed day
            foreach (var day in parent.Days!) 
            {
                // If our task date (which is the start of the next non-passed task week
                // plus the days in the current iteration is greater than right now
                // then we've found our next task date
                if (taskDate.AddDays(day).Date >= currentDateTime.Date)
                {
                    taskDate = taskDate.AddDays(day);
                    break;
                }
            }

            // Create next AssTask
            var newTask = new AssTask
            {
                TaskParentId = parent.Id,
                CreatedAt = DateTime.UtcNow,
                DueAt = taskDate
            };

            return newTask;
        }
    }
}
