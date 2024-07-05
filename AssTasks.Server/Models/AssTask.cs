namespace AssTasks.Server.Models
{
    public class AssTask
    {
        public int Id { get; set; }
        public int TaskParentId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime DueAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int? OwnerId {  get; set; }

        public TaskParent TaskParent { get; set; }
        public User? Owner { get; set; }
    }
}
