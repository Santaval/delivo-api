export default class LocationDescription {

    constructor(private readonly description: string) {}

    static create(description: string): LocationDescription {
        if (description.length === 0) {
            throw new Error("Location description cannot be empty.");
        }
        if (description.length > 255) {
            throw new Error("Location description cannot exceed 255 characters.");
        }
        return new LocationDescription(description);
    }

    get value(): string {
        return this.description;
    }
}