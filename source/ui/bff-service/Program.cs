using Yarp.ReverseProxy.Configuration;

RouteConfig[] GetRoutes()
{
    return new[]
    {
        new RouteConfig()
        {
            RouteId = "countRoute",
            ClusterId = "countServer",
            Match = new RouteMatch
            {
                // Path or Hosts are required for each route. This catch-all pattern matches all request paths.
                Path = "count/{**catch-all}"
            }
        },
        new RouteConfig()
        {
            RouteId = "thingROute",
            ClusterId = "thingServer",
            Match = new RouteMatch
            {
                // Path or Hosts are required for each route. This catch-all pattern matches all request paths.
                Path = "thing/{**catch-all}"
            }
        }
    };
}
    
ClusterConfig[] GetClusters()
{
    var debugMetadata = new Dictionary<string, string>();
    debugMetadata.Add("Debug", "true");

    var countHost = Environment.GetEnvironmentVariable("COUNT_HOST") ?? "count" ;
    var countPort = Environment.GetEnvironmentVariable("COUNT_PORT") ?? "8080" ;

    var thingHost = Environment.GetEnvironmentVariable("THING_HOST") ?? "thing" ;
    var thingPort = Environment.GetEnvironmentVariable("THING_PORT") ?? "5000" ;

    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine( $"http://{thingHost}:{thingPort}/api/");
    Console.WriteLine( $"http://{countHost}:{countPort}/");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");
    Console.WriteLine("**********************************************");

    return new[]
    {
        new ClusterConfig()
        {
            ClusterId = "countServer",
            Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
            {
                { "destination1", new DestinationConfig() { Address = $"http://{countHost}:{countPort}/" } },
            }
        },
        new ClusterConfig()
        {
            ClusterId = "thingServer",
            Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
            {
                { "destination2", new DestinationConfig() { Address = $"http://{thingHost}:{thingPort}/api/" } },
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



