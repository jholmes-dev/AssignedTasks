namespace AssTasks.Server.Models
{
    public class CreateAssTaskView : TaskParent
    {
        public DateTime StartDate { get; set; }
        public int? OwnerId { get; set; } 
    }
}
