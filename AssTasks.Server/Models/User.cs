namespace AssTasks.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<AssTask> AssTasks { get; } = new List<AssTask>();
    }
}