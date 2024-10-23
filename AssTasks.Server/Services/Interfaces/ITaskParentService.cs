using AssTasks.Server.Models;

namespace AssTasks.Server.Services.Interfaces
{
    public interface ITaskParentService
    {
        Task<int> GetNextAsigneeId(TaskParent parent);
    }
}
