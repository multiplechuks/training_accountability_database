using Microsoft.EntityFrameworkCore.Storage;
using TrainingManagement.Core.Interfaces;
using TrainingManagement.Infrastructure.Data;

namespace TrainingManagement.Infrastructure.Services;

public class UnitOfWork : IUnitOfWork
{
    private readonly TrainingDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(TrainingDbContext context)
    {
        _context = context;
        Participants = new ParticipantRepository(_context);
        Trainings = new TrainingRepository(_context);
        ParticipantEnrollments = new ParticipantEnrollmentRepository(_context);
        Allowances = new AllowanceRepository(_context);
        TrainingTransfers = new TrainingTransferRepository(_context);
        AllowanceTypes = new AllowanceTypeRepository(_context);
        AllowanceStatuses = new AllowanceStatusRepository(_context);
    }

    public IParticipantRepository Participants { get; }
    public ITrainingRepository Trainings { get; }
    public IParticipantEnrollmentRepository ParticipantEnrollments { get; }
    public IAllowanceRepository Allowances { get; }
    public ITrainingTransferRepository TrainingTransfers { get; }
    public IAllowanceTypeRepository AllowanceTypes { get; }
    public IAllowanceStatusRepository AllowanceStatuses { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
