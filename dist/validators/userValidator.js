"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidatorClass = void 0;
const class_validator_1 = require("class-validator");
class UserValidatorClass {
}
__decorate([
    (0, class_validator_1.IsOptional)({ groups: ['edit'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "First name required.", groups: ['add'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "First name can not be empty.", groups: ['edit'] })
], UserValidatorClass.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ groups: ['edit'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "Last name required.", groups: ['add'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "Last name can not be empty.", groups: ['edit'] })
], UserValidatorClass.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ groups: ['edit'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email can not be empty.", groups: ['edit'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email is required.", groups: ['add'] }),
    (0, class_validator_1.IsEmail)(undefined, { message: "invalid email", groups: ['add', 'edit'] })
], UserValidatorClass.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ groups: ['edit'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "Password is required.", groups: ['add'] }),
    (0, class_validator_1.MinLength)(8, { groups: ['add'] }),
    (0, class_validator_1.MaxLength)(128, { groups: ['add'] }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/, { message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number", groups: ['add'] })
], UserValidatorClass.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ groups: ['edit'] }),
    (0, class_validator_1.ArrayNotEmpty)({ message: "role is required.", groups: ['add'] })
], UserValidatorClass.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)({ groups: ['add', 'edit'] }),
    (0, class_validator_1.IsNotEmpty)({ message: "address can not be empty.", groups: ['edit'] }),
    (0, class_validator_1.MaxLength)(100, { groups: ['add', 'edit'] })
], UserValidatorClass.prototype, "address", void 0);
exports.UserValidatorClass = UserValidatorClass;
