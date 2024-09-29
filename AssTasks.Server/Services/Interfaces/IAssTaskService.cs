using AssTasks.Server.Models;

namespace AssTasks.Server.Services.Interfaces
{
    public interface IAssTaskService
    {
        AssTask GenerateTaskFromParent(TaskParent parent, DateTime? startDate = null);
        AssTask GenerateIntervalTask(TaskParent parent, DateTime? startDate);
        AssTask GenerateDaysTask(TaskParent parent, DateTime? startDate);
    }
}
