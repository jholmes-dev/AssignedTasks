using AssTasks.Server.Models;
using AssTasks.Server.Constants;
using AssTasks.Server.Services.Interfaces;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Services
{
    public class AssTaskService : IAssTaskService
    {
        private readonly IAssTaskRepository assTaskRepository;

        public AssTaskService(
            IAssTaskRepository assTaskRepository)
        {
            this.assTaskRepository = assTaskRepository;
        }

        /// <summary>
        /// Generates and returns a new AssTask from the given parent
        /// </summary>
        /// <param name="parent">The parent to draw details from</param>
        /// <returns>A newly generated AssTask</returns>
        /// <exception cref="ArgumentOutOfRangeException">Thrown if the provided parent.FrequencyType is not supported</exception>
        public AssTask GenerateTaskFromParent(TaskParent parent, DateTime? startDate) => parent.FrequencyType switch
        {
            TaskConstants.INTERVAL_TASK => GenerateIntervalTask(parent, startDate),
            TaskConstants.DAYS_TASK => GenerateDaysTask(parent, startDate),
            _ => throw new ArgumentOutOfRangeException($"ParentTask.FrequencyType value is not supported: {parent.FrequencyType}"),
        };

        /// <summary>
        /// Generates an interval type task. Interval type tasks are always generated off the current day
        /// as to avoid timing issues when a task is completed early or late.
        /// </summary>
        /// <param name="parent">The task's parent to draw details from</param>
        /// <param name="startDate">The start date of the task</param>
        /// <returns>A new interval based AssTask</returns>
        public AssTask GenerateIntervalTask(TaskParent parent, DateTime? startDate)
        {
            // If startDate is provided, generate for that date. Otherwise we generate based off the parent's period
            var dueDate = startDate ?? DateTime.UtcNow.AddDays(parent.Frequency);

            // Generate new AssTask
            var newTask = new AssTask
            {
                TaskParentId = parent.Id,
                CreatedAt = DateTime.UtcNow,
                DueAt = dueDate
            };

            return newTask;
        }

        public AssTask GenerateDaysTask(TaskParent parent, DateTime? startDate)
        {
            if (parent.Days == null)
            {
                throw new ArgumentNullException(nameof(parent));
            }

            var taskStartDate = startDate ?? DateTime.UtcNow;

            // Set target date to Sunday of task start date week
            var targetDate = taskStartDate.AddDays(-(int)taskStartDate.DayOfWeek);

            // If there are no more upcoming task days this week, add a period to the start date and take the first available day
            // Otherwise take the next available day in the target week
            if (parent.Days.Last() < (int)taskStartDate.DayOfWeek)
            {
                targetDate = targetDate.AddDays((7 * parent.Frequency) + parent.Days.First());
            }
            else
            {
                targetDate = targetDate.AddDays(parent.Days.Where(day => day >= (int)taskStartDate.DayOfWeek).First());
            }

            // Create next AssTask
            var newTask = new AssTask 
            {
                TaskParentId = parent.Id,
                CreatedAt = DateTime.UtcNow,
                DueAt = targetDate
            };

            return newTask;
        }
    }
}
