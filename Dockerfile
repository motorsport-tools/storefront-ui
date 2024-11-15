ARG NODE_VERSION=20.14.0
ARG YARN_VERSION=3.6.1

FROM node:${NODE_VERSION}-slim AS base

ENV DOCKER_BUILDKIT=1

RUN yarn set version ${YARN_VERSION}
WORKDIR /src

# Build
FROM base AS build


ARG NUXT_PUBLIC_ODOO_BASE_URL="https://odoo.motorsport-tools.co.uk/"
ARG NUXT_PUBLIC_ODOO_BASE_IMAGE_URL="https://odoo.motorsport-tools.co.uk/"
ARG NUXT_PUBLIC_MIDDLEWARE_URL="https://storefront-ui-554812423759.europe-west2.run.app/"
ARG NUXT_PUBLIC_MIDDLEWARE_PORT=3000
ARG REDIS_URL="redis://10.154.0.2:6379"
ARG NUXT_ALGOLIA_API_KEY="change_api_key"
ARG NUXT_ALGOLIA_APPLICATION_ID="change_application_id"
ARG PORT=3000
ARG NUXT_STORAGE_PASSWORD


ENV NODE_ENV=production
ENV NUXT_PUBLIC_ODOO_BASE_URL=${NUXT_PUBLIC_ODOO_BASE_URL}
ENV NUXT_PUBLIC_ODOO_BASE_IMAGE_URL=${NUXT_PUBLIC_ODOO_BASE_IMAGE_URL}
ENV NUXT_PUBLIC_MIDDLEWARE_URL=${NUXT_PUBLIC_MIDDLEWARE_URL}
ENV NUXT_PUBLIC_MIDDLEWARE_PORT=${NUXT_PUBLIC_MIDDLEWARE_PORT}
ENV REDIS_URL=${REDIS_URL}
ENV NUXT_PUBLIC_ALGOLIA_ENABLED=0
ENV NUXT_ALGOLIA_API_KEY=${NUXT_ALGOLIA_API_KEY}
ENV NUXT_ALGOLIA_APPLICATION_ID=${NUXT_ALGOLIA_APPLICATION_ID}
ENV NUXT_TELEMETRY_DISABLED=1
ENV NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=1
ENV NUXT_STORAGE_DRIVER=redis
ENV NUXT_STORAGE_URL=redis://10.154.0.2:6379
ENV NUXT_STORAGE_PASSWORD=$NUXT_STORAGE_PASSWORD
ENV NUXT_STORAGE_INVALIDATION_KEY=123
# Currency
ENV NUXT_PUBLIC_CURRENCY_SEPARATOR="."
ENV NUXT_PUBLIC_CURRENCY_DECIMAL="."
ENV NUXT_PUBLIC_CURRENCY_SYMBOL="£"
ENV NUXT_PUBLIC_CURRENCY_PRECISION=2

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

ENV NUXT_PUBLIC_MIDDLEWARE_URL="https://storefront-ui-554812423759.europe-west2.run.app/"
ENV NUXT_PUBLIC_MIDDLEWARE_PORT=3000
ENV NUXT_NODE_LOCALE="en-EN"
ENV NUXT_PUBLIC_VSF_PORT=443
ENV NUXT_SWR_CACHE_TIME=3600

COPY . ./
RUN yarn add -W nuxt \
    && yarn \
    && yarn build

# Run
FROM base

ARG NUXT_PUBLIC_ODOO_BASE_URL="https://odoo.motorsport-tools.co.uk/"
ARG NUXT_PUBLIC_ODOO_BASE_IMAGE_URL="https://odoo.motorsport-tools.co.uk/"
ARG NUXT_PUBLIC_MIDDLEWARE_URL="https://storefront-ui-554812423759.europe-west2.run.app/"
ARG NUXT_PUBLIC_MIDDLEWARE_PORT=8443
ARG NUXT_ALGOLIA_API_KEY=""
ARG NUXT_ALGOLIA_APPLICATION_ID=""
ARG PORT=3000
ARG NUXT_STORAGE_PASSWORD

ENV NODE_ENV=production
ENV REDIS_HOST=10.154.0.2
ENV NUXT_PUBLIC_ODOO_BASE_URL=${NUXT_PUBLIC_ODOO_BASE_URL}
ENV NUXT_PUBLIC_ODOO_BASE_IMAGE_URL=${NUXT_PUBLIC_ODOO_BASE_IMAGE_URL}
ENV NUXT_PUBLIC_MIDDLEWARE_URL=${NUXT_PUBLIC_MIDDLEWARE_URL}
ENV NUXT_PUBLIC_MIDDLEWARE_PORT=${NUXT_PUBLIC_MIDDLEWARE_PORT}
ENV NUXT_PUBLIC_ALGOLIA_ENABLED=0
ENV NUXT_ALGOLIA_API_KEY=${NUXT_ALGOLIA_API_KEY}
ENV NUXT_ALGOLIA_APPLICATION_ID=${NUXT_ALGOLIA_APPLICATION_ID}
ENV NUXT_TELEMETRY_DISABLED=1
ENV NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=1
ENV NUXT_STORAGE_PASSWORD=$NUXT_STORAGE_PASSWORD
ENV NUXT_STORAGE_DRIVER=redis
ENV NUXT_STORAGE_URL=redis://10.154.0.2:6379
ENV NUXT_STORAGE_INVALIDATION_KEY=123
# Currency
ENV NUXT_PUBLIC_CURRENCY_SEPARATOR="."
ENV NUXT_PUBLIC_CURRENCY_DECIMAL="."
ENV NUXT_PUBLIC_CURRENCY_SYMBOL="£"
ENV NUXT_PUBLIC_CURRENCY_PRECISION=2

ENV NODE_TLS_REJECT_UNAUTHORIZED=0


COPY --from=build /src/.output ./

# Expose both ports
ENV HOST=0.0.0.0
EXPOSE $PORT
#EXPOSE 6379
EXPOSE 443

# Specify the command to run your app
CMD [ "node", "/src/server/index.mjs" ]
