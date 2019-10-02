using System.Linq;
using System.Security.Claims;
using System.Web.Http;
namespace DownloadApp.Controllers
{
    public class TestController : ApiController
    {
        //This resource is For all types of role
        [Authorize(Roles = "SuperAdmin, Admin, User")]
        [HttpGet]
        [Route("api/test/resource1")]
        public IHttpActionResult GetResource1()
        {
            var identity = (ClaimsIdentity)User.Identity;
            return Ok("Hello: " + identity.Name);
        }
    }
}