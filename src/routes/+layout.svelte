<script lang="ts">
    import '../app.scss'

    import {onMount} from 'svelte';
    import {firebaseAPP, initialize} from '$lib/firebase';

    let appState: any = null
    firebaseAPP.subscribe(value => appState = value)
    let htmlTag: HTMLHtmlElement | undefined


    onMount(async () => {
        htmlTag = document?.getElementsByTagName("html")[0]
        if (appState !== null) {
            await initialize();
        }
    });
    let isThemeDark = true

    function changeTheme() {
        isThemeDark = !isThemeDark
        if (htmlTag)
            htmlTag.setAttribute("data-theme", isThemeDark ? 'dark' : 'light')
    }
</script>

<nav id="mainNav">
    <ul>
        <li>
            <a href="/">
                <strong>
                    Ligretto
                </strong>
            </a>
        </li>
    </ul>
</nav>

<slot/>


<button class="floater contrast" on:click={changeTheme}></button>

<style>
    #mainNav {
        z-index: 99;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        padding: 0 var(--spacing)
    }

    .floater {
        position: fixed;
        right: calc(var(--spacing) / 2 + var(--scrollbar-width, 0px));
        bottom: var(--spacing);
        width: auto;
        margin-bottom: 0;
        padding: .75rem;
        border-radius: 2rem;
        box-shadow: var(--card-box-shadow);
        line-height: 1;
        text-align: right;
    }

    .floater::after {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: .15rem solid currentColor;
        border-radius: 50%;
        background: linear-gradient(to right, currentColor 0, currentColor 50%, transparent 50%);
        content: "";
        vertical-align: bottom;
        transition: transform var(--transition);
    }
</style>