using DownloadApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Http;

namespace DownloadApp.Controllers
{
    public class DownloadsController : ApiController
    {
        [Authorize(Roles = "User")]
        [HttpGet]
        [Route("api/downloads")]
        public IEnumerable<Download> Get()
        {
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
    }
}
