import DataError from "@/domain/core/errors/DataError";

export default class LocationDescription {

    constructor(private readonly description: string) {}

    static create(description: string): LocationDescription {
        if (description.trim().length === 0) {
            throw new DataError("Location description cannot be empty.");
        }
        if (description.length > 255) {
            throw new DataError("Location description cannot exceed 255 characters.");
        }
        return new LocationDescription(description);
    }

    get value(): string {
        return this.description;
    }
}