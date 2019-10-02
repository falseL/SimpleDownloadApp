using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DownloadApp.Models;

namespace DownloadApp.Controllers
{
    public class DownloadsController : ApiController
    {
        public IEnumerable<Download> Get()
        {
            //using (DownloadDBContext dbContext = new DownloadDBContext())
            //{
            //    return dbContext.Downloads.ToList();
            //}
            using (DownloadDBContext dbContext = new DownloadDBContext())
            {
                var downloadList = dbContext.Downloads.ToList();
                foreach (var item in downloadList)
                {
                    string fullPath = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, item.FilePath));
                    item.FileSize = new System.IO.FileInfo(fullPath).Length;
                }
                return downloadList;
            }
        }
        public Download Get(int id)
        {
            using (DownloadDBContext dbContext = new DownloadDBContext())
            {
                return dbContext.Downloads.FirstOrDefault(e => e.ID == id);
            }
        }
    }
}
