const Service = require('../model/service');

// Get all services
exports.getAllServices = (req, res) => {
    Service.getAll((err, serviceList) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(serviceList);
    });
};

// Get service by ID
exports.getServiceById = (req, res) => {
    const { serviceId } = req.params;
    Service.getById(serviceId, (err, service) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    });
};

// Add a new service
exports.addService = (req, res) => {
    const serviceData = req.body;
    console.log('[addService] Incoming request payload:', serviceData);

    Service.create(serviceData, (err, result) => {
        if (err) {
            console.error('[addService] Error while creating service:', err);
            return res.status(500).json({ error: 'Failed to create service', details: err });
        }

        console.log('[addService] Service created successfully:', result);
        res.status(201).json({ message: 'Service added successfully', data: result });
    });
};

// Update a service
exports.updateService = (req, res) => {
    const { serviceId } = req.params;
    const updatedData = req.body;
    Service.update(serviceId, updatedData, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Service updated successfully', data: result });
    });
};

// Delete a service
exports.deleteService = (req, res) => {
    const { serviceId } = req.params;
    Service.delete(serviceId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    });
};
