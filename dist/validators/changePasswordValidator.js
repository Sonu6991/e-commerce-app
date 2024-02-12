"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordValidatorClass = void 0;
const class_validator_1 = require("class-validator");
const customeValidator_1 = require("./customeValidator");
class ChangePasswordValidatorClass {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required." }),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(128),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number" })
], ChangePasswordValidatorClass.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: "Confirm password is required." }),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(128),
    (0, customeValidator_1.Match)('password')
], ChangePasswordValidatorClass.prototype, "passwordConfirm", void 0);
exports.ChangePasswordValidatorClass = ChangePasswordValidatorClass;
