<script setup lang="ts">
import { type Partner, type MutationCreateUpdatePartnerArgs } from "~/graphql"
import { SfInput, SfSwitch, SfIconCheckBox, SfLoaderCircular } from "@storefront-ui/vue";
const props = defineProps<{
    stepData?: Record<string, any>
    showSummary?: Boolean
    exData?: Partner
}>()

const { $clientPosthog } = useNuxtApp()

const emit = defineEmits<{
    complete: [data: Record<string, any>]
    update: [data: Record<string, any>]
}>()

const form = reactive({
    name: props.exData?.name || '',
    email: props.exData?.email || '',
    phone: props.exData?.phone || '',
    vat: props.exData?.vat || '',
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

const { updatePartner, loading } = useAuth()

const handleSubmit = async () => {
    if(form.name && form.email && form.phone) {
        const data: MutationCreateUpdatePartnerArgs = {
            email: String(form.email),
            name: String(form.name),
            phone: String(form.phone),
            vat: String(form.vat),
            subscribeNewsletter:  form.subscribe,
        };
    
        await updatePartner(data)
        $clientPosthog?.identify(
            data.email,
            { 
                email: data.email, name: data.name
            }
        )
        nextTick()
        emit('complete', { ...form })
    }
}

</script>
<template> 
    <div name="summary md:w-[520px]" v-show="showSummary">
        <div class="mt-2" title="Click to Edit">
            <p><strong>{{ $t("contactInfo.name") }}</strong>:<br/>{{ form.name }}</p>
            <p><strong>{{ $t("contactInfo.email") }}</strong>:<br/>{{ form.email }}</p>
            <p><strong>{{ $t("contactInfo.phone") }}</strong>:<br/>{{ form.phone }}</p>
            <p v-if="form.vat"><strong>{{ $t('contactInfo.vat') }}</strong>:<br/> {{ form.vat }}</p>
            <p v-if="form.subscribe" class="flex flex-row items-center   mt-2"><SfIconCheckBox class="text-green-700" size="sm"/> <strong class="ml-2">{{ $t("contactInfo.hasSubscribe") }}</strong></p>
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
            <div class="mt-4" />
            <label>
                <UiFormLabel>{{ $t("contactInfo.vat") }}</UiFormLabel>
                <SfInput
                    v-model="form.vat"
                    name="vat"
                    type="text"
                    pattern="^(?:[Aa][Tt][Uu]\d{8}|[Bb][Ee]\d{10}|[Bb][Gg]\d{9,10}|[Cc][Yy]\d{8}[A-Za-z]|[Cc][Zz]\d{8,10}|[Dd][Ee]\d{9}|[Dd][Kk]\d{8}|[Ee][Ee]\d{9}|(?:[Ee][Ll]|[Gg][Rr])\d{9}|[Ee][Ss][A-Za-z0-9]\d{7}[A-Za-z0-9]|[Ff][Ii]\d{8}|[Ff][Rr][A-Za-z0-9]{2}\d{9}|[Gg][Bb](?:\d{9}|\d{12}|[Gg][Dd]\d{3}|[Hh][Aa]\d{3})|[Hh][Rr]\d{11}|[Hh][Uu]\d{8}|[Ii][Ee]\d{7}[A-Ww][A-Ww]?|[Ii][Ee](?:[0-9A-Za-z\+\*]\d{7}[A-Ww])|[Ii][Tt]\d{11}|[Ll][Tt]\d{9,12}|[Ll][Uu]\d{8}|[Ll][Vv]\d{11}|[Mm][Tt]\d{8}|[Nn][Ll]\d{9}[Bb]\d{2}|[Pp][Ll]\d{10}|[Pp][Tt]\d{9}|[Rr][Oo]\d{2,10}|[Ss][Ee]\d{12}|[Ss][Ii]\d{8}|[Ss][Kk]\d{10}|[Aa][Uu]\d{11}|[Cc][Aa]\d{9}[Rr][Tt]\d{4}|[Ii][Nn]\d{2}[A-Za-z]{5}\d{4}[A-Za-z][A-Za-z0-9][Zz][A-Za-z0-9]|[Nn][Zz]\d{8,9}|[Zz][Aa]4\d{9}|[Cc][Hh][Ee]-\d{3}\.\d{3}\.\d{3}[Mm][Ww][Ss][Tt])$"
                    placeholder="GB123456782"
                />
            </label>
            <div class="mt-4">
                <label>
                    <UiFormLabel>{{ $t("contactInfo.subescribe") }}</UiFormLabel>
                    <SfSwitch v-model="form.subscribe"  />
                </label>
            </div>

            <button
                :disabled="loading"
                type="submit"
                class="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                v-posthog-capture="{
                    name: 'Contact Information - Continue',
                    properties: {
                    },
                }"
            >
                <SfLoaderCircular 
                    v-if="loading" 
                    size="sm" 
                    class="animate-spin text-current mr-2" 
                />
                Continue
            </button>
        </form>
    </div>
</template>