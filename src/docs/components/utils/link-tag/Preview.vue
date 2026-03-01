<script setup lang="ts">
import { ref } from "vue";

// Docs UI
import PreviewBlock from "@/src/docs/components/ui/PreviewBlock.vue";
import ConfigItem from "@/src/docs/components/ui/configurations/ConfigItem.vue";
import ConfigGroup from "@/src/docs/components/ui/configurations/ConfigGroup.vue";

// Shadcn
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/docs/components/shadcn/ui/select";
import { Input } from "@/src/docs/components/shadcn/ui/input";

// Components
import LinkTag from "@/src/components/utils/link-tag/LinkTag.vue";

const configHref = ref("https://github.com/lichingchester/vsap");
const configExternal = ref("true");
const configNewTab = ref("true");
const configNoLink = ref("false");
</script>

<template>
  <div>
    <PreviewBlock class="relative min-h-32 flex items-center justify-center">
      <LinkTag
        :href="configHref"
        :external="configExternal === 'true'"
        :new-tab="configNewTab === 'true'"
        :no-link="configNoLink === 'true'"
        class="text-lg underline text-[var(--vp-c-brand-1)] hover:text-[var(--vp-c-brand-2)] transition-colors"
      >
        {{ configNoLink === "true" ? "I am a <div>" : "Click me — I am a link" }}
      </LinkTag>
    </PreviewBlock>

    <ConfigGroup>
      <ConfigItem name="href">
        <Input
          v-model="configHref"
          placeholder="URL or path"
          class="w-60"
        />
      </ConfigItem>

      <ConfigItem name="external">
        <Select v-model="configExternal">
          <SelectTrigger as="div">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ConfigItem>

      <ConfigItem name="newTab">
        <Select v-model="configNewTab">
          <SelectTrigger as="div">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ConfigItem>

      <ConfigItem name="noLink">
        <Select v-model="configNoLink">
          <SelectTrigger as="div">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </ConfigItem>
    </ConfigGroup>
  </div>
</template>
