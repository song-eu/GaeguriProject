export interface ResolverMap {
	[key: string]: {
		[key: string]: (parent: any, args: any, context: {}, info: any) => any;
	};
}

export const privateResolver = (resolverFunction) => async (parent, args, context, info) => {
	if (!context.req.user) {
		throw new Error('No JWT. I refuse to proceed');
	}
	const resolved = await resolverFunction(parent, args, context, info);
	return resolved;
};
