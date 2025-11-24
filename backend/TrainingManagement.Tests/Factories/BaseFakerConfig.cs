namespace TrainingManagement.Tests.Factories;

public abstract class BaseFakerConfig<T> where T : class
{
    public abstract T Create();

    public IEnumerable<T> CreateMany(int count = 3)
    {
        return Enumerable.Range(0, count).Select(_ => Create());
    }
}
