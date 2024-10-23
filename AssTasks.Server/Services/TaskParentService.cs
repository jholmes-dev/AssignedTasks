using AssTasks.Server.Models;
using AssTasks.Server.Constants;
using AssTasks.Server.Services.Interfaces;
using AssTasks.Server.Repositories.Interfaces;

namespace AssTasks.Server.Services
{
    public class TaskParentService : ITaskParentService
    {
        private readonly IUserRepository userRepository;
        private readonly IAssTaskRepository assTaskRepository;

        public TaskParentService(
            IUserRepository userRepository,
            IAssTaskRepository assTaskRepository)
        {
            this.userRepository = userRepository;
            this.assTaskRepository = assTaskRepository;
        }

        /// <summary>
        /// Returns the ID of the User to assign a task to next
        /// </summary>
        /// <param name="parent">The TaskParent we're finding the next aignee for</param>
        /// <returns>An int Id of the next task assignee</returns>
        public async Task<int> GetNextAsigneeId(TaskParent parent)
        {
            // Take owner ID of most recently completed task for parent
            var mostRecentTask = (await assTaskRepository
                .GetAsync(x => x.CompletedAt != null, x => x.OrderByDescending(y => y.CompletedAt)))
                .First();

            // Get a list of UserIds this task is assignable to
            var availableUserIds = parent.AssignableTo == null || parent.AssignableTo.Count == 0 ?
                (await userRepository.GetAsync(x => true, x => x.OrderBy(y => y.Id))).Select(x => x.Id).ToList() : // All Users
                parent.AssignableTo; // Only Users who can be assigned the task

            // Get next assignable User ID
            var nextAssigneeIndex = availableUserIds.FindIndex(x => x == mostRecentTask?.OwnerId) + 1;
            return (nextAssigneeIndex >= availableUserIds.Count ? availableUserIds[0] : availableUserIds[nextAssigneeIndex]);
        }
    }
}
