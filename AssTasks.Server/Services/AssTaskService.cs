using AssTasks.Server.Models;
using AssTasks.Server.Constants;

namespace AssTasks.Server.Services
{
    public class AssTaskService
    {
        private readonly AssTasksContext _context;

        public Task<AssTask> GenerateTaskFromParent(TaskParent parent)
        {
            // Split off task creation between two different types
            if (parent.FrequencyType == INTERVAL_TASK)
            {
                // Generate interval task
            }
            else if (parent.FrequencyType == DAYS_TASK)
            {
                // Generate days task
            }

            return null;
        }

        public Task<AssTask> GenerateIntervalTaskFromParent(TaskParent parent)
        {
            // Get the most recent task generated under the given parent
            var recentATask = _context.AssTasks
                .OrderByDescending(x => x.CompletedAt)
                .FirstOrDefault();

            // No tasks exist, make new one
            // TODO: Check above for null, use that to determine if task or parent date should be use to advance period
        }
    }
}
