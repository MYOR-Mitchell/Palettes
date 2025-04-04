FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY Palettes.API/Palettes.API.csproj Palettes.API/
COPY Palettes.Core/Palettes.Core.csproj Palettes.Core/
COPY Palettes.Data/Palettes.Data.csproj Palettes.Data/
RUN dotnet restore "./Palettes.API/Palettes.API.csproj"
COPY . .
WORKDIR "/src/Palettes.API"
RUN dotnet build "./Palettes.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Palettes.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Palettes.API.dll"]