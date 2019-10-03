using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Web.Http;

[assembly: OwinStartup(typeof(DownloadApp.Startup))]

namespace DownloadApp
{
    // In this class we will Configure the OAuth Authorization Server.
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);

            OAuthAuthorizationServerOptions options = new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true,
                //The Path For generating the Toekn
                TokenEndpointPath = new PathString("/token"),
                //Setting the Token Expired Time
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(1),
                //validate the user credentials
                Provider = new MyAuthorizationServerProvider()
            };
            //Token Generations
            app.UseOAuthAuthorizationServer(options);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

            HttpConfiguration config = new HttpConfiguration();
            WebApiConfig.Register(config);
        }
    }

}
