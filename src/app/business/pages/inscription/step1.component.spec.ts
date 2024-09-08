import { Step1Component } from "./step1.component"

describe('@Step1Component', () => {
	let component: Step1Component;

	let StubRouter = jasmine.createSpyObj('Router', ['navigate']);

	let presenter = jasmine.createSpyObj('InscriptionPresenter', ['navigate']);


	beforeEach(() => {
		component = new Step1Component(StubRouter, presenter);
	});

	describe('When call nextStep', () => {
		it('#Should called navigate function', () => {
			const mock = StubRouter.navigate;

			component.nextStep();

			expect(mock).toHaveBeenCalled();
		})
	})

})