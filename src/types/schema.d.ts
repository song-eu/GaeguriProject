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
		Username?: string;
		Password?: string;
		position?: string;
		Position_id?: number;
		stack?: Array<string>;
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

	interface EmailSignUpMutationArgs {
		Username: string;
		Password: string;
		Email: string;
		position?: string;
		Position_id?: number;
		stack?: Array<string>;
		AboutMe?: string;
	}

	interface EmailSignUpResponse {
		ok: boolean;
		error: string | null;
		token: string | null;
	}

	interface EmailLoginMutationArgs {
		Email: string;
		Password: string;
	}

	interface EmailLoginResponse {
		ok: boolean;
		error: string | null;
		token: string | null;
	}

	interface SocialLoginMutationArgs {
		Email?: string;
		Username?: string;
		Facebook_id?: string;
	}

	interface GetChatQueryArgs {
		Project_id: number;
	}

	interface GetDMQueryArgs {
		Message_id: number;
	}

	interface SendChatMutationArgs {
		Contents?: string;
		Project_id: number;
	}

	interface SendDMMutationArgs {
		Contents?: string;
		Message_id: number;
	}

	interface OpenDMMutationArgs {
		Receiver_id: number;
	}

	interface GetYourProfileQueryArgs {
		User_id?: number;
		Username?: string;
	}

	interface SearchUserQueryArgs {
		keywords?: string;
	}
	interface ToggleFollowMutationArgs {
		User_id: number;
	}
}

// tslint:enable
