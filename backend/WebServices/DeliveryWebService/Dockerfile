FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build

WORKDIR /app

EXPOSE 5004

COPY Common/ ./Common/

COPY Database/DeliveryDatabase/ ./Database/DeliveryDatabase/

COPY WebServices/DeliveryWebService/ ./WebServices/DeliveryWebService/

RUN dotnet restore WebServices/DeliveryWebService/DeliveryWebService.csproj

RUN dotnet publish WebServices/DeliveryWebService/DeliveryWebService.csproj -c Release -o out

WORKDIR /app/out

ENTRYPOINT ["dotnet", "DeliveryWebService.dll"]

