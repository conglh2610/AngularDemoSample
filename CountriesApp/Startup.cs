using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CountriesApp.Startup))]
namespace CountriesApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
