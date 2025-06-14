<template>
  <TheHeader />

  <main class="narrow-container">
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="mt-5 mb-10" />
    <div ata-testid="account-layout">
      <h1
        v-if="isRoot"
        class="mb-10 md:mb-10 md:mx-0 font-bold typography-headline-3 md:typography-headline-2"
      >
        {{ $t("account.heading") }}
      </h1>
      <div v-else class="flex justify-start items-center mb-10 mt-4">
        <div v-for="({ subsections }, i) in sections" :key="i">
          <div
            v-for="{ label, link } in subsections"
            :key="label"
            class="font-bold typography-headline-3"
          >
            <h1 v-if="currentPath === link">{{ label }}</h1>
          </div>
        </div>
        <SfButton
          :tag="NuxtLink"
          to="/my-account"
          class="flex md:hidden whitespace-nowrap"
          size="sm"
          variant="tertiary"
        >
          <template #prefix>
            <SfIconArrowBack />
          </template>
          {{ $t("account.back") }}
        </SfButton>
      </div>
      <div class="md:flex gap-10 pb-20" data-testid="account-page-sidebar">
        <div
          :class="[
            'border-t md:border border-neutral-200 pt-4 pb-4 md:p-4 md:rounded-md min-w-[300px] md:block',
            { hidden: !isRoot },
          ]"
        >
          <ul
            v-for="{ title, icon, subsections } in sections"
            :key="title"
            class="[&:not(:last-child)]:mb-4"
          >
            <SfListItem
              class="py-4 md:py-2 hover:!bg-transparent font-medium !cursor-auto px-0 md:px-4"
            >
              <template #prefix><component :is="icon" /></template>
              {{ title }}
            </SfListItem>
            <li v-for="{ label, link } in subsections" :key="label">
              <SfListItem
                :tag="NuxtLink"
                :to="link"
                :class="[
                  'first-of-type:py-4 md:first-of-type:px-4 md:first-of-type:py-2 px-0 md:px-4 rounded-md active:bg-primary-100 !text-neutral-900',
                  {
                    'font-medium bg-primary-100':
                    router.currentRoute.value.path.startsWith(link),
                  },
                ]"
              >
                <template #prefix><SfIconBase /></template>
                {{ label }}
                <template #suffix
                  ><div class="block md:hidden">
                    <SfIconChevronRight /></div
                ></template>
              </SfListItem>
            </li>
          </ul>
          <UiDivider />
          <ul>
            <SfListItem
              :tag="NuxtLink"
              class="py-4 md:py-2 mt-4 rounded-md active:bg-primary-100 !text-neutral-900"
              @click="handleLogout"
            >
              <template #prefix><SfIconLogout /></template>
              {{ $t("account.logout") }}
            </SfListItem>
          </ul>
        </div>
        <div class="flex-1">
          <section
            class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-y-6 md:gap-x-2 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 md:mb-5"
            data-testid="category-grid"
          >
            <slot />
          </section>
        </div>
      </div>
    </div>
  </main>
  <Newsletter />
  <LazyTheFooter />
  <LazyWishlistSidebar />
  <LazyBottomNavbar />
</template>

<script setup>
import {
  SfIconBase,
  SfIconLogout,
  SfIconPerson,
  SfIconShoppingCart,
  SfListItem,
  SfButton,
  SfIconArrowBack,
  SfIconChevronRight,
} from "@storefront-ui/vue";

const NuxtLink = resolveComponent("NuxtLink");
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { logout } = useAuth();

const sections = [
  {
      title: t("account.accountSettings.heading"),
      icon: SfIconPerson,
      subsections: [
          {
              label: t("account.accountSettings.section.personalData"),
              link: "/my-account/personal-data",
          },
          {
              label: t("account.accountSettings.section.billingDetails"),
              link: "/my-account/billing-details",
          },
          {
              label: t("account.accountSettings.section.shippingDetails"),
              link: "/my-account/shipping-details",
          },
      ],
  },
  {
      title: t("account.myOrders.heading"),
      icon: SfIconShoppingCart,
      subsections: [
          {
              label: t("account.myOrders.section.myOrders"),
              link: "/my-account/my-orders?page=1",
          },
      ],
  },
]

const currentPath = computed(() => router.currentRoute.value.path);
const path = "/my-account";
const rootPathRegex = new RegExp(`^${path}/?$`);
const isRoot = computed(() => rootPathRegex.test(currentPath.value));

const findCurrentPage = computed(() => {
  if (currentPath.value.startsWith(`${path}/my-orders`)) {
    if (route.params.id) {
      return {
        label: `${t("account.myOrders.orderDetails.heading")} #${route.params.id}`,
        link: currentPath.value,
      };
    } else {
      return null;
    }
  }

  return sections
    .flatMap(({ subsections }) => subsections)
    .find(({ link }) => currentPath.value.includes(link));
});

const breadcrumbs = computed(() => {
  const breadcrumbsArray = [
    { name: t("home"), link: "/" },
    { name: t("account.heading"), link: "/my-account" },
  ];

  if (currentPath.value.startsWith(`${path}/my-orders`) && !route.params.id) {
    breadcrumbsArray.push({
      name: t("account.myOrders.heading"),
      link: `${path}/my-orders`,
    });
  }

  if (route.params.id) {
    breadcrumbsArray.push({
      name: t("account.myOrders.heading"),
      link: `${path}/my-orders`,
    });
    breadcrumbsArray.push({
      name: `${t("account.myOrders.orderDetails.heading")} #${route.params.id}`,
      link: currentPath.value,
    });
  } else if (findCurrentPage.value) {
    breadcrumbsArray.push({
      name: findCurrentPage.value?.label,
      link: findCurrentPage.value?.link,
    });
  }

  return breadcrumbsArray;
});

const handleLogout = async () => {
  await logout();
  router.push("/");
};
</script>
