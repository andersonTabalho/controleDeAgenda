import { Type } from "@angular/core";

export type NavRoute = {
	icon: string;
	name: string;
	route: string;
	component: Type<any>;
	authLevel?: readonly string[];
};
