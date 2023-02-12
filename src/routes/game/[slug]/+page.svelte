<script lang="ts">
    import type {PageData} from './$types';
    import {onMount} from "svelte";
    import {updateGame} from "$lib/firebase";

    let gameData = null
    let loadingData = true
    let gameId = null
    export let data: PageData;

    let currentPlayerForm = 0
    let currentPlayerScore

    onMount(() => {
        gameData = data.data
        gameId = data.slug
        loadingData = false
    })


    async function addRound() {
        loadingData = true
        gameData.currentRound++
        currentPlayerForm = 0
        await updateGame(gameId, gameData)
        gameData = gameData
        loadingData = false
    }

    async function updateScore() {
        if (isNaN(currentPlayerScore) || !currentPlayerScore)
            return
        gameData.scores[currentPlayerForm].score.push(currentPlayerScore)
        gameData = gameData
        if (currentPlayerForm === gameData.scores.length - 1)
            await addRound()
        else
            currentPlayerForm++
        currentPlayerScore = undefined
    }

</script>

<main class="container" id="main">
    {#if !loadingData}
        <article>
            <h2>
                Classement
            </h2>
            <table role="grid">
                <thead>
                <tr>
                    <th scope="col">Manche</th>
                    {#each gameData.scores as player}
                        <th scope="col">{player.name}</th>
                    {/each}
                </tr>
                </thead>
                <tbody>
                {#each Array(gameData.currentRound) as _, round}
                    <tr>
                        <th scope="row">{round + 1}</th>
                        {#each gameData.scores as player, index}
                            <td>
                                {player.score[round]}
                            </td>
                        {/each}
                    </tr>
                {/each}
                </tbody>
                <tfoot>
                <tr>
                    <th scope="col">Total</th>
                    {#each gameData.scores as player, index}
                        <td>
                            <strong>
                                {player.score.reduce((partialSum, a) => partialSum + a, 0)}
                            </strong>
                        </td>
                    {/each}
                </tr>
                </tfoot>
            </table>
        </article>
        <article>
            <h2>
                Ajouter les résultats de la manche {gameData.currentRound + 1}
            </h2>
            <form on:submit|preventDefault={updateScore}>
                <label for="playerInput">
                    Score de {gameData.scores[currentPlayerForm].name}
                    <input bind:value={currentPlayerScore} id="playerInput" placeholder="Score"
                           type="number">
                </label>
                <button type="submit">
                    Ajouter le score
                </button>
            </form>
        </article>
    {:else }
        <article aria-busy="true">
            Chargement
        </article>
    {/if}
</main>