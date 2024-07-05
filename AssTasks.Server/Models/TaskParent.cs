namespace AssTasks.Server.Models
{
    public class TaskParent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public int Priority { get; set; }
        public int Frequency { get; set; }
        public int FrequencyType { get; set; }
        public List<int>? Days { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<AssTask> AssTasks { get; } = new List<AssTask>();
    }
}
