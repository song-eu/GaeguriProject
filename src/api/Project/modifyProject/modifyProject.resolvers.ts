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
			let result = [];
			const today = new Date();

			for (let props of Object.keys(input).slice(1)) {
				//console.log('props?????', props, `${props} : ${input[props]}`);
				const prj = await Project.findOne({ where: { Project_id: Project_id } });
				if (!prj) {
					result.push({
						ok: false,
						error: 'undefined Project_id',
						path: 'updateProjectInfo_Project_id',
						project: null,
					});
					return result;
				}
				if (props !== 'Status') {
					prj[props] = input[props];
					await prj.save().catch((error) => {
						result.push({
							ok: false,
							error: error.message,
							path: `updateProjectInfo_${props}`,
							project: null,
						});
					});
				} else {
					if (prj.status === 'Start') {
						if (input[props] === 'End') {
							prj.StartAt = today;
							prj.status = input[props];
							await prj.save();
							const project = await Project.createQueryBuilder('Project')
								.leftJoinAndSelect('Project.projectpositionno', 'ppn')
								.leftJoinAndSelect('Project.projectstack', 'ps')
								.leftJoin('ps.stack', 'stack')
								.leftJoin('ppn.position', 'position')
								.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
								.leftJoin('PC.candidate', 'PCU')
								.where('Project.Project_id = :Project_id')
								.setParameter('Project_id', Project_id)
								.addSelect('stack.Stack_name')
								.addSelect('position.Position_name')
								.addSelect('PC')
								.addSelect('PCU')
								.getOne();

							result.push({
								ok: true,
								error: null,
								path: 'updateProjectStatus',
								project: project,
							});
						} else {
							result.push({
								ok: false,
								error: 'Already Started',
								path: 'updateProjectStatus',
								project: null,
							});
						}
					} else if (prj.status === 'await') {
						if (input[props] === 'Start') {
							prj.StartAt = today;
							prj.status = input[props];
							await prj.save();

							const project = await Project.createQueryBuilder('Project')
								.leftJoinAndSelect('Project.projectpositionno', 'ppn')
								.leftJoinAndSelect('Project.projectstack', 'ps')
								.leftJoin('ps.stack', 'stack')
								.leftJoin('ppn.position', 'position')
								.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
								.leftJoin('PC.candidate', 'PCU')
								.where('Project.Project_id = :Project_id')
								.setParameter('Project_id', Project_id)
								.addSelect('stack.Stack_name')
								.addSelect('position.Position_name')
								.addSelect('PC')
								.addSelect('PCU')
								.getOne();

							result.push({
								ok: true,
								error: null,
								path: 'updateProjectStatus',
								project: project,
							});
						} else {
							result.push({
								ok: false,
								error: 'Not Started Yet',
								path: 'updateProjectStatus',
								project: null,
							});
						}
					} else {
						result.push({
							ok: false,
							error: 'Already terminated project',
							path: 'updateProjectStatus',
							project: null,
						});
					}
				}
				if (prj) {
					const project = await Project.createQueryBuilder('Project')
						.leftJoinAndSelect('Project.projectpositionno', 'ppn')
						.leftJoinAndSelect('Project.projectstack', 'ps')
						.leftJoin('ps.stack', 'stack')
						.leftJoin('ppn.position', 'position')
						.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
						.leftJoin('PC.candidate', 'PCU')
						.where('Project.Project_id = :Project_id')
						.setParameter('Project_id', Project_id)
						.addSelect('stack.Stack_name')
						.addSelect('position.Position_name')
						.addSelect('PC')
						.addSelect('PCU')
						.getOne();

					result.push({
						ok: true,
						error: null,
						path: `updateProjectInfo_${props}`,
						project: project,
					});
				}
			}
			return result;
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
						const project = await Project.createQueryBuilder('Project')
							.leftJoinAndSelect('Project.projectpositionno', 'ppn')
							.leftJoinAndSelect('Project.projectstack', 'ps')
							.leftJoin('ps.stack', 'stack')
							.leftJoin('ppn.position', 'position')
							.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
							.leftJoin('PC.candidate', 'PCU')
							.where('Project.Project_id = :Project_id')
							.setParameter('Project_id', Project_id)
							.addSelect('stack.Stack_name')
							.addSelect('position.Position_name')
							.addSelect('PC')
							.addSelect('PCU')
							.getOne();

						result.push({
							ok: true,
							error: null,
							path: 'updateProjectStack.delete',
							project: project,
						});
					} else {
						result.push({
							ok: false,
							error: 'nothing updated',
							path: 'updateProjectStack.delete',
							project: null,
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

								const project = await Project.createQueryBuilder('Project')
									.leftJoinAndSelect('Project.projectpositionno', 'ppn')
									.leftJoinAndSelect('Project.projectstack', 'ps')
									.leftJoin('ps.stack', 'stack')
									.leftJoin('ppn.position', 'position')
									.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
									.leftJoin('PC.candidate', 'PCU')
									.where('Project.Project_id = :Project_id')
									.setParameter('Project_id', Project_id)
									.addSelect('stack.Stack_name')
									.addSelect('position.Position_name')
									.addSelect('PC')
									.addSelect('PCU')
									.getOne();

								result.push({
									ok: true,
									error: null,
									path: 'updateProjectStack.add',
									project: project,
								});
							} else {
								result.push({
									ok: false,
									error: `${add} Already Exist Stack`,
									path: 'updateProjectStack.add',
									project: null,
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
						ok: false,
						error: error.message,
						path: 'updateProjectStack',
						project: null,
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
								const project = await Project.createQueryBuilder('Project')
									.leftJoinAndSelect('Project.projectpositionno', 'ppn')
									.leftJoinAndSelect('Project.projectstack', 'ps')
									.leftJoin('ps.stack', 'stack')
									.leftJoin('ppn.position', 'position')
									.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
									.leftJoin('PC.candidate', 'PCU')
									.where('Project.Project_id = :Project_id')
									.setParameter('Project_id', Project_id)
									.addSelect('stack.Stack_name')
									.addSelect('position.Position_name')
									.addSelect('PC')
									.addSelect('PCU')
									.getOne();

								result.push({
									ok: true,
									error: null,
									path: 'updateProjectNoOfPosition.delete',
									project: project,
								});
							}
						} else {
							result.push({
								ok: false,
								error: `Position_id : ${delVal.Position_id} delete Fail`,
								path: 'updateProjectNoOfPosition.delete',
								project: null,
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
								const project = await Project.createQueryBuilder('Project')
									.leftJoinAndSelect('Project.projectpositionno', 'ppn')
									.leftJoinAndSelect('Project.projectstack', 'ps')
									.leftJoin('ps.stack', 'stack')
									.leftJoin('ppn.position', 'position')
									.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
									.leftJoin('PC.candidate', 'PCU')
									.where('Project.Project_id = :Project_id')
									.setParameter('Project_id', Project_id)
									.addSelect('stack.Stack_name')
									.addSelect('position.Position_name')
									.addSelect('PC')
									.addSelect('PCU')
									.getOne();
								result.push({
									ok: true,
									error: null,
									path: 'updateProjectNoOfPosition.add',
									project: project,
								});
							} else {
								result.push({
									ok: false,
									error: `${addVal.Position_name} add Fail`,
									path: 'updateProjectNoOfPosition.add',
									project: null,
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
							await pp.save();

							const project = await Project.createQueryBuilder('Project')
								.leftJoinAndSelect('Project.projectpositionno', 'ppn')
								.leftJoinAndSelect('Project.projectstack', 'ps')
								.leftJoin('ps.stack', 'stack')
								.leftJoin('ppn.position', 'position')
								.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
								.leftJoin('PC.candidate', 'PCU')
								.where('Project.Project_id = :Project_id')
								.setParameter('Project_id', Project_id)
								.addSelect('stack.Stack_name')
								.addSelect('position.Position_name')
								.addSelect('PC')
								.addSelect('PCU')
								.getOne();

							result.push({
								ok: true,
								error: null,
								path: 'updateProjectNoOfPosition.update',
								project: project,
							});
						} else {
							result.push({
								ok: false,
								error: `${upVal.Position_id} Count update Fail`,
								path: 'updateProjectNoOfPosition.update',
								project: null,
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
					const project = await Project.createQueryBuilder('Project')
						.leftJoinAndSelect('Project.projectpositionno', 'ppn')
						.leftJoinAndSelect('Project.projectstack', 'ps')
						.leftJoin('ps.stack', 'stack')
						.leftJoin('ppn.position', 'position')
						.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
						.leftJoin('PC.candidate', 'PCU')
						.where('Project.Project_id = :Project_id')
						.setParameter('Project_id', Project_id)
						.addSelect('stack.Stack_name')
						.addSelect('position.Position_name')
						.addSelect('PC')
						.addSelect('PCU')
						.getOne();

					result.push({
						ok: true,
						error: null,
						path: 'updateProjectStatus',
						project: project,
					});
				} else {
					result.push({
						ok: false,
						error: 'Already Started',
						path: 'updateProjectStatus',
						project: null,
					});
				}
			} else if (prj.status === 'await') {
				if (Status === 'Start') {
					prj.StartAt = today;
					prj.status = Status;
					await prj.save();

					const project = await Project.createQueryBuilder('Project')
						.leftJoinAndSelect('Project.projectpositionno', 'ppn')
						.leftJoinAndSelect('Project.projectstack', 'ps')
						.leftJoin('ps.stack', 'stack')
						.leftJoin('ppn.position', 'position')
						.leftJoin('ppn.PC', 'PC', 'PC.Allowed = :allowed', { allowed: 'Allowed' })
						.leftJoin('PC.candidate', 'PCU')
						.where('Project.Project_id = :Project_id')
						.setParameter('Project_id', Project_id)
						.addSelect('stack.Stack_name')
						.addSelect('position.Position_name')
						.addSelect('PC')
						.addSelect('PCU')
						.getOne();

					result.push({
						ok: true,
						error: null,
						path: 'updateProjectStatus',
						project: project,
					});
				} else {
					result.push({
						ok: false,
						error: 'Not Started Yet',
						path: 'updateProjectStatus',
						project: null,
					});
				}
			} else {
				result.push({
					ok: false,
					error: 'Already terminated project',
					path: 'updateProjectStatus',
					project: null,
				});
			}
			return result;
		},
	},
};
