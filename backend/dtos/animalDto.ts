export interface AnimalDTO {
    result: {
        classification: {
            suggestions: [
                {
                    name: string
                }
            ]
        }
    }
}