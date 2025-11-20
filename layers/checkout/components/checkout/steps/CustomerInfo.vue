<script setup lang="ts">
import { type Partner, type MutationCreateUpdatePartnerArgs } from "~/graphql"
import { SfInput, SfSwitch } from "@storefront-ui/vue";
const props = defineProps<{
    stepData?: Record<string, any>
    showSummary?: Boolean
    exData?: Partner
}>()

const emit = defineEmits<{
    complete: [data: Record<string, any>]
    update: [data: Record<string, any>]
}>()

const form = reactive({
    name: props.exData?.name || '',
    email: props.exData?.email || '',
    phone: props.exData?.phone || '',
    subscribe: false,
})

onMounted(() => {
    if (props.stepData) {
        Object.assign(form, props.stepData)
    }
})

watch(
  () => props.exData,
  (newPartnerData) => {
    if (newPartnerData?.isPublic && newPartnerData?.id === 4) {
      form.name = "";
    }
  },
  { immediate: true }
)

const { updatePartner } = useAuth()

const handleSubmit = async () => {
    if(form.name && form.email && form.phone) {
        const data: MutationCreateUpdatePartnerArgs = {
            email: String(form.email),
            name: String(form.name),
            phone: String(form.phone),
            subscribeNewsletter:  form.subscribe,
        };
    
        await updatePartner(data)

        emit('complete', { ...form })
    }
}

</script>
<template>
    <div
        data-testid="checkout-contact"
        class="md:px-4 py-6"
    >
        <h2 class="text-neutral-900 text-lg font-bold mb-4">
            {{ $t('contactInfo.heading') }}
        </h2>
        <div name="summary" v-show="showSummary">
            <div class="mt-2 md:w-[520px]">
                <p><strong>{{ $t("contactInfo.name") }}</strong> {{ form.name }}</p>
                <p><strong>{{ $t("contactInfo.email") }}</strong> {{ form.email }}</p>
                <p><strong>{{ $t("contactInfo.phone") }}</strong> {{ form.phone }}</p>
                <p><strong>{{ $t("contactInfo.subescribe") }}</strong> {{ form.subscribe }}</p>
            </div>
        </div>
        <div v-show="!showSummary">
            <form 
                data-testid="contact-information-form"
                @submit.prevent="handleSubmit"
                class="space-y-4 md:w-[520px]"
            >
                <label>
                    <UiFormLabel>{{ $t("contactInfo.name") }}</UiFormLabel>
                    <SfInput
                        v-model="form.name"
                        name="name"
                        type="text"
                        :placeholder="$t('contactInfo.name')"
                        required
                    />
                </label>
                <div class="mt-4" />
                <label>
                    <UiFormLabel>{{ $t("contactInfo.email") }}</UiFormLabel>
                    <SfInput
                        v-model="form.email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        :placeholder="$t('contactInfo.email')"
                        required
                    />
                </label>
                <div class="mt-4" />
                <label>
                    <UiFormLabel>{{ $t("contactInfo.phone") }}</UiFormLabel>
                    <SfInput
                        v-model="form.phone"
                        name="phone"
                        type="tel"
                        placeholder="+44 123 456"
                        required
                    />
                </label>
                <div class="mt-4">
                    <label>
                        <UiFormLabel>{{ $t("contactInfo.subescribe") }}</UiFormLabel>
                        <SfSwitch v-model="form.subscribe"  />
                    </label>
                </div>

                <button 
                    type="submit"
                    class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                    Continue
                </button>
            </form>
        </div>
    </div>
</template>