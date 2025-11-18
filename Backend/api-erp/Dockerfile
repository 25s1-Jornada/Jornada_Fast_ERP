FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore as distinct layers to leverage Docker caching
COPY Backend/api-erp/api-erp.csproj ./api-erp/
RUN dotnet restore ./api-erp/api-erp.csproj

# Copy the remainder of the source and publish
COPY Backend/api-erp/. ./api-erp
WORKDIR /src/api-erp
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "api-erp.dll"]
