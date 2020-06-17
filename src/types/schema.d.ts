// tslint:disable
// graphql typescript definitions

declare namespace GQL {
	interface IGraphQLResponseRoot {
		data?: IQuery | IMutation;
		errors?: Array<IGraphQLResponseError>;
	}

	interface IGraphQLResponseError {
		/** Required for all errors */
		message: string;
		locations?: Array<IGraphQLResponseErrorLocation>;
		/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
		[propName: string]: any;
	}

	interface IGraphQLResponseErrorLocation {
		line: number;
		column: number;
	}

	interface IQuery {
		__typename: 'Query';
		hello: string;
	}

	interface IHelloOnQueryArguments {
		name?: string | null;
	}

	interface IMutation {
		__typename: 'Mutation';
		register: boolean | null;
	}

	interface IRegisterOnMutationArguments {
		email: string;
		password: string;
	}

	interface UpdateMyProfileMutationArgs {
		Username?: string | number;
		position?: Array<string>;
		AboutMe?: string;
		Career?: string;
		Grade?: number;
		User_url?: string;
		Profile_photo_path?: string;
		User_role?: string;
		Allow_Invitation?: boolean;
	}

	interface UpdateMyProfileResponse {
		ok: boolean;
		error: string | null;
	}
}

// tslint:enable
