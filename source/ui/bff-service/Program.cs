using Yarp.ReverseProxy.Configuration;

RouteConfig[] GetRoutes()
{
    return new[]
    {
        new RouteConfig()
        {
            RouteId = "route1",
            ClusterId = "cluster1",
            Match = new RouteMatch
            {
                // Path or Hosts are required for each route. This catch-all pattern matches all request paths.
                Path = "{**catch-all}"
            }
        }
    };
}
    
ClusterConfig[] GetClusters()
{
    var debugMetadata = new Dictionary<string, string>();
    debugMetadata.Add("Debug", "true");

    return new[]
    {
        new ClusterConfig()
        {
            ClusterId = "cluster1",
            SessionAffinity = new SessionAffinityConfig { Enabled = true, Policy = "Cookie", AffinityKeyName = ".Yarp.ReverseProxy.Affinity" },
            Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
            {
                { "destination1", new DestinationConfig() { Address = "https://example.com" } },
                { "debugdestination1", new DestinationConfig() {
                    Address = "https://bing.com",
                    Metadata = debugMetadata  }
                },
            }
        }
    };
}



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddReverseProxy().LoadFromMemory(GetRoutes(), GetClusters());

builder.Services.AddCors(options =>
{
   options.AddDefaultPolicy(policy => {
       policy.AllowAnyOrigin()
       .AllowAnyHeader()
       .AllowAnyMethod();
       //.AllowCredentials();
    
   });
});

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.UseEndpoints(endpoints => {
    endpoints.MapGet("/settings", () =>
    {
        return new Dictionary<string, string?>
        {
            {
                "instrumentationKey", Environment.GetEnvironmentVariable("ApplicationInsightsKey") ?? "test" 
            }
        };
    });

    endpoints.MapReverseProxy();
    
    endpoints.MapFallbackToFile("/index.html");
});

app.Run();



