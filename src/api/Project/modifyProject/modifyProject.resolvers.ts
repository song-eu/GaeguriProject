import { ResolverMap } from '../../../types/graphql.utils';
import { createQueryBuilder } from 'typeorm';
import { Project } from '../../../entities/Project';
import { PSProjectStack } from '../../../entities/PS_ProjectStack';
import { Stack } from '../../../entities/Stack';
import { Position } from '../../../entities/Position';
import { PPProjectPositionNo } from '../../../entities/PP_ProjectPositionNo';

export const resolvers: ResolverMap = {
	Mutation: {
		updateProjectInfo: async (_, { input }) => {
			console.log(input);
			const { Project_id } = input;

			for (let props of Object.keys(input).slice(1)) {
				//console.log('props?????', props, `${props} : ${input[props]}`);
				const prj = await Project.findOne({ where: { Project_id: Project_id } });
				if (!prj) {
					return [
						{
							path: 'updateProjectInfo',
							message: 'undefined Project_id',
						},
					];
				}
				prj[props] = input[props];
				await prj.save().catch((error) => {
					return [
						{
							path: 'updateProjectInfo',
							message: error,
						},
					];
				});
				if (prj) {
					return [
						{
							path: 'updateProjectInfo',
							message: 'Success',
						},
					];
				}
			}
		},
		updateProjectStack: async (_, { input }) => {
			try {
				const { Project_id } = input;
				let result = [];

				if (input.delete) {
					console.log(input.delete);
					const subQ = await createQueryBuilder('Stack').select('Stack_id').where('Stack.Stack_name IN (:sname)');
					const ps = await createQueryBuilder()
						.delete()
						.from('PSProjectStack')
						.where('Project_id = :Project_id', { Project_id })
						.andWhere('Stack_id IN (' + subQ.getQuery() + ')')
						.setParameter('sname', input.delete)
						.execute();
					if (ps.affected) {
						result.push({
							path: 'updateProjectStack.delete',
							message: 'Sucess',
						});
					} else {
						result.push({
							path: 'updateProjectStack.delete',
							message: 'Fail',
						});
					}
					console.log('delete ps???????', ps);
				}
				if (input.add) {
					const addLoopFunc = async (addInput) => {
						for await (let add of addInput) {
							let newStack = await Stack.findOne({ Stack_name: add });
							if (!newStack) {
								newStack = await Stack.create({ Stack_name: add }).save();
							}

							let newPS = await PSProjectStack.findOne({
								Project_id,
								Stack_id: newStack.Stack_id,
							});

							if (!newPS) {
								newPS = await PSProjectStack.create({
									Project_id,
									Stack_id: newStack.Stack_id,
								}).save();

								result.push({
									path: 'updateProjectStack.add',
									message: `${add} input Sucess`,
								});
							} else {
								result.push({
									path: 'updateProjectStack.add',
									message: `${add} Already Exist Stack`,
								});
							}
							console.log('add PS ?????', newPS);
						}
					};
					await addLoopFunc(input.add);
				}

				console.log(result);
				return result;
			} catch (error) {
				return [
					{
						path: 'updateProjectStack.excute',
						message: error,
					},
				];
			}
		},
		updateProjectNoOfPosition: async (_, { input }) => {
			console.log(input);
			const { Project_id } = input;
			let result = [];
			if (input.delete) {
				const deleteLoopFunc = async (delPosition) => {
					for await (let delVal of delPosition) {
						let pp = await PPProjectPositionNo.createQueryBuilder('PPProjectPositionNo')
							.leftJoinAndSelect('PPProjectPositionNo.PC', 'PC')
							.where({
								Project_id,
								...delVal,
							})
							.getOne();
						console.log('--------pp', pp, 'pp.PC.length', pp.PC.length);

						if (!pp.PC) {
							let delPP = await createQueryBuilder()
								.delete()
								.from('PPProjectPositionNo')
								.where({
									Project_id,
									...delVal,
								})
								.execute();

							console.log('pp.affected-------', delPP.affected);

							if (delPP.affected) {
								result.push({
									path: 'updateProjectNoOfPosition.delete',
									message: `${delPP.affected} delete Success`,
								});
							}
						} else {
							result.push({
								path: 'updateProjectNoOfPosition.delete',
								message: `Position_id : ${delVal.Position_id} delete Fail`,
							});
						}
					}
				};
				await deleteLoopFunc(input.delete);
			}
			if (input.add) {
				const addLoopFunc = async (addPosition) => {
					for await (let addVal of addPosition) {
						let newPostion = await Position.findOne({ Position_name: addVal.Position_name });
						if (!newPostion) {
							newPostion = await Position.create({ Position_name: addVal.Position_name }).save();
						}

						let newPPN = await PPProjectPositionNo.findOne({
							Project_id,
							Position_id: newPostion.Position_id,
						});
						if (!newPPN) {
							newPPN = await PPProjectPositionNo.create({
								Project_id,
								Position_id: newPostion.Position_id,
								NoOfPosition: addVal.Position_count,
							}).save();
							if (newPPN) {
								result.push({
									path: 'updateProjectNoOfPosition.add',
									message: `${addVal.Position_name} add Success`,
								});
							} else {
								result.push({
									path: 'updateProjectNoOfPosition.add',
									message: `${addVal.Position_name} add Fail`,
								});
							}
						}
					}
				};
				await addLoopFunc(input.add);
			}
			if (input.update) {
				const updateLoopFunc = async (updatePosition) => {
					for await (let upVal of updatePosition) {
						let pp = await PPProjectPositionNo.findOne({
							relations: ['PC'],
							where: {
								Project_id,
								Position_id: upVal.Position_id,
							},
						});
						console.log('pp', pp.PC.length);
						if (pp.PC.length <= upVal.Position_count) {
							pp.NoOfPosition = upVal.Position_count;
							pp.save();

							result.push({
								path: 'updateProjectNoOfPosition.update',
								message: `${upVal.Position_id} Count update Success`,
							});
						} else {
							result.push({
								path: 'updateProjectNoOfPosition.update',
								message: `${upVal.Position_id} Count update Fail`,
							});
						}
					}
				};
				await updateLoopFunc(input.update);
			}
			return result;
		},
		updateProjectStatus: async (_, { input }) => {
			console.log(input);
			const { Project_id, Status } = input;
			const today = new Date();
			let result = [];
			console.log(today);

			const prj = await Project.findOne({
				Project_id,
			});
			if (prj.status === 'Start') {
				if (Status === 'End') {
					prj.StartAt = today;
					prj.status = Status;
					await prj.save();
					result.push({
						path: 'updateProjectStatus',
						message: 'Success',
					});
				} else {
					result.push({
						path: 'updateProjectStatus',
						message: 'Already Started',
					});
				}
			} else if (prj.status === 'await') {
				if (Status === 'Start') {
					prj.StartAt = today;
					prj.status = Status;
					await prj.save();
					result.push({
						path: 'updateProjectStatus',
						message: 'Success',
					});
				} else {
					result.push({
						path: 'updateProjectStatus',
						message: 'Not Started Yet',
					});
				}
			} else {
				result.push({
					path: 'updateProjectStatus',
					message: 'Already terminated project',
				});
			}
			return result;
		},
	},
};
