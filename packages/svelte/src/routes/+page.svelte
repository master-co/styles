<script lang="ts">
    import type { Config } from "@master/css";
    import CSSRuntimeProvider from "../lib/CSSRuntimeProvider.svelte";

    let containerRef = $state<HTMLDivElement>();
    let config = $state<Config>({
        components: {
            btn: "b:2|red",
        },
    });
    let root = $state<ShadowRoot | Document | undefined | null>();
    let destroy = $state(false);

    $effect(() => {
        if (containerRef) {
            containerRef.attachShadow({ mode: "open" });
        } else {
            root = null
        }
    });

    $effect(() => {
        if (!destroy) {
            const shadowContent = document.createElement("div");
            shadowContent.innerHTML = "SHADOW CONTENT";
            shadowContent.className = "fg:red-60";
            containerRef?.shadowRoot?.appendChild(shadowContent);
        }
    });
</script>

{#if destroy}
    <button onclick={() => (destroy = false)}>INIT</button>
{/if}

{#if !destroy}
    <CSSRuntimeProvider {config} {root}>
        <button onclick={() => (destroy = true)}>DESTROY</button>
        <button
            id="config-btn"
            class="btn bg:blue-50"
            onclick={() => (config = {})}>CONFIG</button
        >
        <button
            id="root-btn"
            onclick={() => {
                root = containerRef?.shadowRoot;
            }}>ROOT</button
        >
        <div bind:this={containerRef}></div>
    </CSSRuntimeProvider>
{/if}
