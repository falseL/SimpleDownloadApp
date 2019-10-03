using DownloadApp.Models;
using System;
using System.Linq;

namespace DownloadApp
{
    public class UserMasterRepository : IDisposable
    {
        DownloadDBContext context = new DownloadDBContext();
        public User ValidateUser(string username, string password)
        {
            return context.Users.FirstOrDefault(user =>
            user.UserID.Equals(username, StringComparison.OrdinalIgnoreCase)
            && user.Password == password);
        }
        public void Dispose()
        {
            context.Dispose();
        }
    }
}