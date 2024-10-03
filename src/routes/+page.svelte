<script lang="ts">
	import type { UserDB } from '../classes/DatabaseClasses';

	async function getUsers() {
		const response = await fetch('http://localhost:3000/users', {
			method: 'GET',
			credentials: 'include'
		});

		users = await response.json();
	}

	function loadUsers() {
		getUsers();
		usersLoaded = true;
	}

	let users: UserDB[] = [];
	let usersLoaded = false;
</script>

<div class="p-5">
	<h1 class="text-4xl font-medium mb-3">Welcome to Larben</h1>
	<p class="mb-10">
		<a href="/login" class="underline text-blue-400">Login</a> or
		<a href="/register" class="underline text-blue-400">Register</a>
	</p>
	<button
		on:click={loadUsers}
		class="border border-black border-2 px-2 py-1 bg-slate-200 rounded mb-2"
		>Click me to load some users!</button
	>
	{#if usersLoaded}
		<p>Users count: {users.length}</p>
		{#each users as user}
			<p>{user.username}</p>
		{/each}
	{/if}
</div>
