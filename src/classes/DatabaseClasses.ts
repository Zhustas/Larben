interface UserDB {
	readonly id: number;
	name: string | null;
	lastName: string | null;
	birthDate: Date | null;
	readonly username: string;
	email: string;
	password: string;
	description: string | null;
	readonly guildId: number | null;
}

interface SessionTokenDB {
	readonly id: number;
	readonly userId: number;
	token: string;
	readonly tokenCreated: Date;
}

interface PostDB {
	readonly id: number;
	readonly userId: number;
	readonly text: string;
	readonly postDateTime: Date;
	likes: number;
}

interface MarkerDB {
	readonly id: number;
	readonly userId: number;
	description: string | null;
	latitude: number;
	longitude: number;
}

export type { UserDB, SessionTokenDB, PostDB, MarkerDB };
